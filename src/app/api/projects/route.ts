import { NextResponse } from 'next/server';
import { DesignProject } from '@/types';

// In-memory server fallback store for API endpoints
let serverProjects: DesignProject[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const filtered = userId ? serverProjects.filter((p) => p.userId === userId) : serverProjects;

  return NextResponse.json({
    success: true,
    data: filtered,
    count: filtered.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DesignProject;

    if (!body.title || !body.productId || !body.ipId) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다 (title, productId, ipId)' },
        { status: 400 }
      );
    }

    const newProject: DesignProject = {
      ...body,
      id: body.id || `proj-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = serverProjects.findIndex((p) => p.id === newProject.id);
    if (existingIndex >= 0) {
      serverProjects[existingIndex] = newProject;
    } else {
      serverProjects.unshift(newProject);
    }

    return NextResponse.json({
      success: true,
      data: newProject,
      message: '프로젝트가 저장되었습니다.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '잘못된 요청 본문입니다.' },
      { status: 400 }
    );
  }
}
